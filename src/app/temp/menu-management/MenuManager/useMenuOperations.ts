/* 
  파일명: /app/temp/menu-management/MenuManager/useMenuOperations.ts
  기능: 메뉴 관리 관련 비즈니스 로직을 담당하는 커스텀 훅
  책임: 메뉴 데이터 로딩, 할당/해제, 저장 등의 작업 처리
*/ // ------------------------------

import { useState, useCallback } from 'react';

import { getAllMenuList } from '@/services/menu/menu_all_GET';
import { getParkingLotMenuList } from '@/services/menu/menu_parking_lot@parkinglotId_GET';
import { bulkAssignMenuToParkingLots } from '@/services/menu/menu_parking_lot_bulk_assign_PUT';
import { removeMenuFromParkingLot } from '@/services/menu/menu_parking_lot@parkinglotId_remove_PUT';

// #region 타입 정의
export interface MenuItem {
  id: number;
  name: string;
  depth: number;
  level: number;
  parentId?: number;
  href?: string;
  url?: string;
  children?: MenuItem[];
}
// #endregion

export function useMenuOperations() {
  // #region 상태
  const [allMenus, setAllMenus] = useState<MenuItem[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [assignedMenuIds, setAssignedMenuIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  // #endregion

  // #region 유틸리티 함수
  const flattenMenus = (menus: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = [];
    
    const flatten = (items: MenuItem[], currentLevel: number) => {
      items.forEach(item => {
        const processedItem = {
          ...item,
          level: currentLevel,
          href: item.href || item.url || '#'
        };
        result.push(processedItem);
        
        if (item.children && item.children.length > 0) {
          flatten(item.children, currentLevel + 1);
        }
      });
    };
    
    flatten(menus, 1);
    return result;
  };

  const buildMenuTree = (menus: MenuItem[]): MenuItem[] => {
    const menuMap = new Map<number, MenuItem>();
    const rootMenus: MenuItem[] = [];
    
    menus.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });
    
    menus.forEach(menu => {
      const menuItem = menuMap.get(menu.id)!;
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(menuItem);
      } else {
        rootMenus.push(menuItem);
      }
    });
    
    return rootMenus;
  };
  // #endregion

  // #region 데이터 로딩 함수
  const loadAllMenus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllMenuList();
      
      if (response.success && response.data?.menus) {
        const flatMenus = flattenMenus(response.data.menus);
        setAllMenus(flatMenus);
        
        const treeMenus = buildMenuTree(flatMenus);
        setMenuTree(treeMenus);
        
        const topLevelMenuIds = new Set(flatMenus.filter(m => m.level === 1).map(m => m.id));
        setExpandedMenus(topLevelMenuIds);
        
        console.log('📋 전체 메뉴 (평면화):', flatMenus);
        console.log('🌳 메뉴 트리:', treeMenus);
      }
    } catch (error) {
      console.error('메뉴 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadParkingLotMenus = async (parkingLotId: number) => {
    try {
      setLoading(true);
      const response = await getParkingLotMenuList(parkingLotId);
      
      if (response.success && response.data?.menus) {
        const flatMenus = flattenMenus(response.data.menus as MenuItem[]);
        const menuIds = new Set(flatMenus.map(menu => menu.id));
        setAssignedMenuIds(menuIds);
        console.log('📋 주차장 할당 메뉴 (평면화):', flatMenus);
      } else {
        setAssignedMenuIds(new Set());
      }
    } catch (error) {
      console.error('주차장 메뉴 로딩 실패:', error);
      setAssignedMenuIds(new Set());
    } finally {
      setLoading(false);
    }
  };
  // #endregion

  // #region 이벤트 핸들러
  const toggleMenu = (menuId: number) => {
    const newAssignedMenuIds = new Set(assignedMenuIds);
    
    if (newAssignedMenuIds.has(menuId)) {
      newAssignedMenuIds.delete(menuId);
    } else {
      newAssignedMenuIds.add(menuId);
    }
    
    setAssignedMenuIds(newAssignedMenuIds);
  };

  const toggleAllMenus = () => {
    if (assignedMenuIds.size === allMenus.length) {
      setAssignedMenuIds(new Set());
    } else {
      setAssignedMenuIds(new Set(allMenus.map(menu => menu.id)));
    }
  };

  const toggleMenuExpansion = (menuId: number) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const saveChanges = async (selectedParkingLot: number) => {
    if (!selectedParkingLot) return;

    try {
      setSaving(true);
      
      const currentResponse = await getParkingLotMenuList(selectedParkingLot);
      const currentMenus = flattenMenus((currentResponse.data?.menus || []) as MenuItem[]);
      const currentMenuIds = new Set(currentMenus.map(menu => menu.id));

      const toAssign = Array.from(assignedMenuIds).filter(id => !currentMenuIds.has(id)) as number[];
      const toRemove = Array.from(currentMenuIds).filter(id => !assignedMenuIds.has(id)) as number[];

      const promises = [];
      
      if (toAssign.length > 0) {
        promises.push(bulkAssignMenuToParkingLots([selectedParkingLot], toAssign));
      }
      
      if (toRemove.length > 0) {
        promises.push(removeMenuFromParkingLot(selectedParkingLot, toRemove));
      }

      await Promise.all(promises);
      
      alert('변경사항이 저장되었습니다.');
      
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };
  // #endregion

  return {
    // 상태
    allMenus,
    menuTree,
    assignedMenuIds,
    loading,
    saving,
    expandedMenus,
    
    // 함수
    loadAllMenus,
    loadParkingLotMenus,
    toggleMenu,
    toggleAllMenus,
    toggleMenuExpansion,
    saveChanges,
  };
}