'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface MoveResidentServerRequest {
  resident_id: number;                              // snake_case
  target_household_instance_id: number;             // snake_case
  relationship?: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
  memo?: string;
}

interface ParkingLotServerResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  created_at: Date;                                 // snake_case
  updated_at: Date;                                 // snake_case
}

interface HouseholdServerResponse {
  id: number;
  parkinglot_id: number;                           // snake_case
  address_1_depth: string;                         // snake_case
  address_2_depth: string;                         // snake_case
  address_3_depth?: string;                        // snake_case
  household_type: string;                          // snake_case
  memo?: string;
  created_at: Date;                                // snake_case
  updated_at: Date;                                // snake_case
  parkinglot: ParkingLotServerResponse;
}

interface HouseholdInstanceServerResponse {
  id: number;
  household_id: number;                            // snake_case
  instance_name?: string;                          // snake_case
  password?: string;
  start_date?: Date;                               // snake_case
  end_date?: Date;                                 // snake_case
  memo?: string;
  created_at: Date;                                // snake_case
  updated_at: Date;                                // snake_case
  household: HouseholdServerResponse;
}

interface ResidentHouseholdServerResponse {
  id: number;
  resident_id: number;                             // snake_case
  household_instance_id: number;                   // snake_case
  relationship: string;
  memo?: string;
  created_at: Date;                                // snake_case
  updated_at: Date;                                // snake_case
  deleted_at?: Date | null;                        // snake_case
  household_instance: HouseholdInstanceServerResponse; // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: MoveResidentRequest): MoveResidentServerRequest {
  return {
    resident_id: client.residentId,
    target_household_instance_id: client.targetHouseholdInstanceId,
    relationship: client.relationship,
    memo: client.memo,
  };
}

function serverToClientParkingLot(server: ParkingLotServerResponse) {
  return {
    id: server.id,
    code: server.code,
    name: server.name,
    description: server.description,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function serverToClientHousehold(server: HouseholdServerResponse) {
  return {
    id: server.id,
    parkinglotId: server.parkinglot_id,
    address1Depth: server.address_1_depth,
    address2Depth: server.address_2_depth,
    address3Depth: server.address_3_depth,
    householdType: server.household_type,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    parkinglot: serverToClientParkingLot(server.parkinglot),
  };
}

function serverToClientHouseholdInstance(server: HouseholdInstanceServerResponse) {
  return {
    id: server.id,
    householdId: server.household_id,
    instanceName: server.instance_name,
    password: server.password,
    startDate: server.start_date,
    endDate: server.end_date,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    household: serverToClientHousehold(server.household),
  };
}

function serverToClient(server: ResidentHouseholdServerResponse): ResidentHouseholdResponse {
  return {
    id: server.id,
    residentId: server.resident_id,
    householdInstanceId: server.household_instance_id,
    relationship: server.relationship,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
    householdInstance: serverToClientHouseholdInstance(server.household_instance),
  };
}
//#endregion

export interface MoveResidentRequest {
  residentId: number;
  targetHouseholdInstanceId: number;
  relationship?: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
  memo?: string;
}

export interface ResidentHouseholdResponse {
  id: number;
  residentId: number;
  householdInstanceId: number;
  relationship: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  householdInstance: {
    id: number;
    householdId: number;
    instanceName?: string;
    password?: string;
    startDate?: Date;
    endDate?: Date;
    memo?: string;
    createdAt: Date;
    updatedAt: Date;
    household: {
      id: number;
      parkinglotId: number;
      address1Depth: string;
      address2Depth: string;
      address3Depth?: string;
      householdType: string;
      memo?: string;
      createdAt: Date;
      updatedAt: Date;
      parkinglot: {
        id: number;
        code: string;
        name: string;
        description?: string;
        createdAt: Date;
        updatedAt: Date;
      };
    };
  };
}

/**
 * 같은 현장 내에서 거주자를 다른 세대로 이동시킨다 (이력 보존)
 * @param data 거주자 이동 정보
 * @returns 거주자-세대 관계 정보 (ResidentHouseholdResponse)
 */
export async function moveResident(data: MoveResidentRequest) {
  const serverRequest = clientToServer(data);
  
  const response = await fetchDefault('/residents/move', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 세대 이동 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as ResidentHouseholdServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 