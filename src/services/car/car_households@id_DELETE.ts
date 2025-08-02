'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteCarHouseholdServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: DeleteCarHouseholdServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

/**
 * 차량과 세대 간의 연결을 삭제한다 (연결된 모든 거주자 관계도 함께 삭제됨)
 * @param id 차량-세대 연결 ID
 * @returns 삭제 성공 여부
 */
export async function deleteCarHouseholdRelation(id: number) {
  const response = await fetchDefault(`/cars/households/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return {
      success: true,
      data: { message: '차량-세대 연결이 성공적으로 삭제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-세대 연결 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as DeleteCarHouseholdServerResponse;
  const clientData = serverToClient(serverResponse);

  return {
    success: true,
    data: clientData,
  };
}