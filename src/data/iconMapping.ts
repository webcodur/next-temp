import { 
  Car, Network, Megaphone, FlaskConical, Construction,
  Settings, Users, ShoppingCart, Shield, CreditCard,
  Home, Building, MessageSquare, Mail, Vote,
  Bell, FileText, Activity, Calendar, Wrench,
  Archive, Lock, ChartBar,
  UserCheck, UserX, Car as CarIcon, Truck,
  LucideIcon
} from 'lucide-react';

/**
 * API 메뉴명을 Lucide 아이콘으로 매핑하는 시스템
 * 서버에서 받은 메뉴 데이터의 아이콘 이름을 실제 아이콘 컴포넌트로 변환
 */
export interface IconMapping {
  [key: string]: LucideIcon;
}

export const iconMapping: IconMapping = {
  // 대분류 아이콘
  '주차': Car,
  'parking': Car,
  'Car': Car,
  '커뮤니티': Network,
  'community': Network,
  'Network': Network,
  '공지사항': Megaphone,
  'announcement': Megaphone,
  'Megaphone': Megaphone,
  '연구소': FlaskConical,
  'lab': FlaskConical,
  'FlaskConical': FlaskConical,
  'temp': Construction,
  'Construction': Construction,
  
  // 시설관리 관련
  '시설관리': Settings,
  'facility': Settings,
  '주차장정보': Home,
  'info': Home,
  '근무자관리': Users,
  'admin': Users,
  '차단기설정': Shield,
  'barrier': Shield,
  '출입정책': Lock,
  'entry': Lock,
  'policy': Lock,
  
  // 이용자관리 관련
  '이용자관리': Users,
  'users': Users,
  '입출차관리': Activity,
  'entryexit': Activity,
  '차량등록': CarIcon,
  'member': CarIcon,
  '방문자관리': UserCheck,
  'visitor': UserCheck,
  '세대관리': Building,
  'resident-household': Building,
  '블랙리스트': UserX,
  'blacklist': UserX,
  
  // 상가관리 관련
  '상가관리': ShoppingCart,
  'stores': ShoppingCart,
  '점포현황': Building,
  'status': Building,
  
  // 보안순찰 관련
  '보안순찰': Shield,
  'security': Shield,
  '순찰일지': FileText,
  'patrol-log': FileText,
  '순찰설정': Settings,
  'patrol-config': Settings,
  
  // 결제정산 관련
  '결제정산': CreditCard,
  'payment': CreditCard,
  '할인권관리': Archive,
  'discounts': Archive,
  '정산기관리': ChartBar,
  'settlement': ChartBar,
  '결제관리': CreditCard,
  'billing': CreditCard,
  
  // 시설서비스 관련
  '시설서비스': Building,
  'facilities': Building,
  '시설상품등록': Wrench,
  'registration': Wrench,
  '예약현황': Calendar,
  'reservations': Calendar,
  '출입관리': Lock,
  'access': Lock,
  
  // 소통관리 관련
  '소통관리': MessageSquare,
  'communication': MessageSquare,
  '일대일게시판': MessageSquare,
  'board': MessageSquare,
  '신문고관리': Mail,
  'suggestions': Mail,
  
  // 생활서비스 관련
  '생활서비스': Home,
  'services': Home,
  '관리비': CreditCard,
  'maintenance-fee': CreditCard,
  '전자투표': Vote,
  'voting': Vote,
  '택배관리': Truck,
  'delivery': Truck,
  
  // 공지관리 관련
  '공지관리': Bell,
  'notices': Bell,
  '일반공지': Bell,
  'general': Bell,
  '긴급공지': Activity,
  'emergency': Activity,
  '이벤트공지': Calendar,
  'event': Calendar,
  
  // 푸시알림 관련
  '푸시알림': Bell,
  'push': Bell,
  '알림발송': Mail,
  'send': Mail,
  '발송이력': FileText,
  'history': FileText,
  '템플릿관리': Archive,
  'template': Archive,
  
  // 기본 아이콘 (매핑되지 않은 경우 사용)
  'default': Settings,
};

/**
 * 메뉴 키 또는 이름을 기반으로 아이콘을 반환하는 함수
 * @param menuKey 메뉴 키 또는 이름
 * @returns 해당하는 Lucide 아이콘 컴포넌트
 */
export function getIconByKey(menuKey: string): LucideIcon {
  // 대소문자 무관하게 매핑
  const normalizedKey = menuKey.toLowerCase().trim();
  
  // 직접 매핑된 키 찾기
  if (iconMapping[normalizedKey]) {
    return iconMapping[normalizedKey];
  }
  
  // 키에서 특정 키워드 찾기
  const keywords = Object.keys(iconMapping);
  for (const keyword of keywords) {
    if (normalizedKey.includes(keyword.toLowerCase())) {
      return iconMapping[keyword];
    }
  }
  
  // 기본 아이콘 반환
  return iconMapping.default;
}

/**
 * API 응답에서 받은 메뉴 데이터의 아이콘 이름을 실제 아이콘으로 변환
 * @param iconName API에서 받은 아이콘 이름
 * @returns Lucide 아이콘 컴포넌트
 */
export function mapApiIconToComponent(iconName?: string): LucideIcon {
  if (!iconName) return iconMapping.default;
  return getIconByKey(iconName);
} 