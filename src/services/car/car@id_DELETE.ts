'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteCarServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: DeleteCarServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

/**
 * 차량을 삭제한다 (소프트 삭제)
 * @param id 차량 ID
 * @returns 삭제 성공 여부
 */
export async function deleteCar(id: number) {
  const response = await fetchDefault(`/cars/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return {
      success: true,
      data: { message: '차량이 성공적으로 삭제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as DeleteCarServerResponse;
  const clientData = serverToClient(serverResponse);

  return {
    success: true,
    data: clientData,
  };
}