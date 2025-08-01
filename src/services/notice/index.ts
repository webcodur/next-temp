/**
 * @path src/services/notice/index.ts
 * @description 공지사항 API 서비스 인덱스
 */

export { searchNotices } from './notice$_GET';
export { getNotice } from './notice@id_GET';
export { createNotice } from './notice_POST';
export { updateNotice } from './notice@id_PUT';
export { deleteNotice } from './notice@id_DELETE';