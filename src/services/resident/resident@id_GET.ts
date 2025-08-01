'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface ParkingLotServerResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
}

interface HouseholdServerResponse {
  id: number;
  parkinglot_id: number;         // snake_case
  address_1_depth: string;       // snake_case
  address_2_depth: string;       // snake_case
  address_3_depth?: string;      // snake_case
  household_type: string;        // snake_case
  memo?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
  parkinglot: ParkingLotServerResponse;
}

interface HouseholdInstanceServerResponse {
  id: number;
  household_id: number;          // snake_case
  instance_name?: string;        // snake_case
  password?: string;
  start_date?: Date;             // snake_case
  end_date?: Date;               // snake_case
  memo?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
  household: HouseholdServerResponse;
}

interface ResidentHouseholdServerResponse {
  id: number;
  resident_id: number;           // snake_case
  household_instance_id: number; // snake_case
  relationship: string;
  memo?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
  deleted_at?: Date | null;      // snake_case
  household_instance: HouseholdInstanceServerResponse; // snake_case
}

interface ResidentDetailServerResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birth_date?: Date;             // snake_case
  gender?: string;
  emergency_contact?: string;    // snake_case
  memo?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
  resident_households: ResidentHouseholdServerResponse[]; // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
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

function serverToClientResidentHousehold(server: ResidentHouseholdServerResponse) {
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

function serverToClient(server: ResidentDetailServerResponse): ResidentDetailResponse {
  return {
    id: server.id,
    name: server.name,
    phone: server.phone,
    email: server.email,
    birthDate: server.birth_date,
    gender: server.gender,
    emergencyContact: server.emergency_contact,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    residentHouseholds: server.resident_households.map(serverToClientResidentHousehold),
  };
}
//#endregion

export interface ResidentDetailResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthDate?: Date;
  gender?: string;
  emergencyContact?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
  residentHouseholds: {
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
  }[];
}

/**
 * 특정 거주자의 상세 정보를 조회한다
 * @param id 거주자 ID
 * @returns 거주자 상세 정보 (ResidentDetailResponse)
 */
export async function getResidentDetail(id: number) {
  const response = await fetchDefault(`/residents/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 상세 조회 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as ResidentDetailServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 