/* 
  파일명: /app/temp/menu-management/MenuManager/useMenuOperations.ts
  기능: 메뉴 관리 관련 비즈니스 로직을 담당하는 커스텀 훅
  책임: 메뉴 데이터 로딩, 할당/해제, 저장 등의 작업 처리
*/ // ------------------------------

import { useState, useCallback } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';

import { getAllMenuList } from '@/services/menu/menu_all_GET';
import { getParkingLotMenuList } from '@/services/menu/menu_parking_lot@parkinglotId_GET';
import { bulkAssignMenuToParkingLots } from '@/services/menu/menu_parking_lot_bulk_assign_PUT';
import { removeMenuFromParkingLot } from '@/services/menu/menu_parking_lot@parkinglotId_remove_PUT';
import { updateMenuOrder } from '@/services/menu/menu@menuId_order_PUT';

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
  const [originalAssignedMenuIds, setOriginalAssignedMenuIds] = useState<Set<number>>(new Set()); // 저장용 백업
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

  // 특정 메뉴의 모든 하위 메뉴 ID를 재귀적으로 수집
  const getAllChildMenuIds = (menuId: number, menus: MenuItem[]): number[] => {
    const childIds: number[] = [];
    
    const findChildren = (parentId: number) => {
      menus.forEach(menu => {
        if (menu.parentId === parentId) {
          childIds.push(menu.id);
          findChildren(menu.id); // 재귀 호출
        }
      });
    };
    
    findChildren(menuId);
    return childIds;
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
        

      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const loadParkingLotMenus = useCallback(async (parkingLotId: number) => {
    try {
      setLoading(true);
      const response = await getParkingLotMenuList(parkingLotId);
      
      if (response.success && response.data?.menus) {
        const flatMenus = flattenMenus(response.data.menus as MenuItem[]);
        const menuIds = new Set(flatMenus.map(menu => menu.id));
        setAssignedMenuIds(menuIds);
        setOriginalAssignedMenuIds(menuIds); // 저장용 백업
      } else {
        setAssignedMenuIds(new Set());
        setOriginalAssignedMenuIds(new Set());
      }
    } catch {
      setAssignedMenuIds(new Set());
      setOriginalAssignedMenuIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAssignedMenus = useCallback(() => {
    setAssignedMenuIds(new Set());
    setOriginalAssignedMenuIds(new Set());
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const toggleMenu = useCallback((menuId: number) => {
    const newAssignedMenuIds = new Set(assignedMenuIds);
    
    // 하위 메뉴 ID들 수집
    const childMenuIds = getAllChildMenuIds(menuId, allMenus);
    const hasChildren = childMenuIds.length > 0;
    
    if (hasChildren) {
      // 상위 메뉴: 자신과 모든 하위 메뉴들을 함께 처리
      const allMenuIds = [menuId, ...childMenuIds];
      const allChecked = allMenuIds.every(id => newAssignedMenuIds.has(id));
      
      if (allChecked) {
        // 모두 체크되어 있으면 → 모두 해제
        allMenuIds.forEach(id => newAssignedMenuIds.delete(id));
      } else {
        // 하나라도 체크되지 않았으면 → 모두 체크
        allMenuIds.forEach(id => newAssignedMenuIds.add(id));
      }
    } else {
      // 하위 메뉴 없음: 개별 메뉴만 토글
      if (newAssignedMenuIds.has(menuId)) {
        newAssignedMenuIds.delete(menuId);
      } else {
        newAssignedMenuIds.add(menuId);
      }
    }
    
    setAssignedMenuIds(newAssignedMenuIds);
  }, [assignedMenuIds, allMenus]);



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

  const saveChanges = useCallback(async (selectedParkingLot: number) => {
    if (!selectedParkingLot) return;

    try {
      setSaving(true);
      
      const toAssign = Array.from(assignedMenuIds).filter(id => !originalAssignedMenuIds.has(id)) as number[];
      const toRemove = Array.from(originalAssignedMenuIds).filter(id => !assignedMenuIds.has(id)) as number[];

      const promises = [];
      
      if (toAssign.length > 0) {
        promises.push(bulkAssignMenuToParkingLots([selectedParkingLot], toAssign));
      }
      
      if (toRemove.length > 0) {
        promises.push(removeMenuFromParkingLot(selectedParkingLot, toRemove));
      }

      await Promise.all(promises);
      
      // 저장 성공 시 원본 상태를 현재 상태로 업데이트
      setOriginalAssignedMenuIds(new Set(assignedMenuIds));
      
      alert('변경사항이 저장되었습니다.');
      
    } catch {
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }, [assignedMenuIds, originalAssignedMenuIds]);
  // #endregion

  // #region DND 관련 함수
  const reorderMenusInTree = useCallback((menuTree: MenuItem[], activeId: number, overId: number): MenuItem[] => {
    // 깊은 복사를 위한 재귀 함수
    const deepClone = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => ({
        ...item,
        children: item.children ? deepClone(item.children) : undefined
      }));
    };
    
    const clonedTree = deepClone(menuTree);
    
    // 같은 부모를 가진 메뉴들만 순서 변경 가능
    let sourceParent: MenuItem | null = null;
    let targetParent: MenuItem | null = null;
    let sourceIndex = -1;
    let targetIndex = -1;
    let sourceItem: MenuItem | null = null;
    
    // DFS로 activeId와 overId를 찾기
    const findMenuRecursive = (menus: MenuItem[], parent: MenuItem | null = null): void => {
      if (!Array.isArray(menus)) return;
      
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        
        // 타입 가드
        if (!menu || typeof menu !== 'object' || typeof menu.id !== 'number') {
          continue;
        }
        
        if (menu.id === activeId) {
          sourceParent = parent;
          sourceIndex = i;
          sourceItem = menu;
        }
        
        if (menu.id === overId) {
          targetParent = parent;
          targetIndex = i;
        }
        
        if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
          findMenuRecursive(menu.children, menu);
        }
      }
    };
    
    findMenuRecursive(clonedTree);
    
    // 같은 부모가 아니면 순서 변경하지 않음
    if ((sourceParent as MenuItem | null)?.id !== (targetParent as MenuItem | null)?.id || !sourceItem) {
      return menuTree;
    }
    
    // 순서 변경 수행
    const targetMenus = sourceParent ? (sourceParent as MenuItem).children! : clonedTree;
    targetMenus.splice(sourceIndex, 1);
    targetMenus.splice(targetIndex, 0, sourceItem);
    
    return clonedTree;
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active || active.id === over.id) {
      return;
    }
    
    const activeId = Number(String(active.id));
    const overId = Number(String(over.id));
    
    // 메뉴 트리에서 순서 변경
    const reorderedTree = reorderMenusInTree(menuTree, activeId, overId);
    setMenuTree(reorderedTree);
    
    try {
      // 서버에 순서 변경 요청
      // 새로운 순서는 over 아이템의 순서를 기준으로 계산
      const targetMenu = allMenus.find(m => m.id === overId);
      if (targetMenu) {
        // 같은 부모를 가진 메뉴들 중에서의 새로운 순서 계산
        const siblingsWithSameParent = allMenus.filter(m => {
          const activeMenu = allMenus.find(am => am.id === activeId);
          return m.parentId === activeMenu?.parentId;
        });
        
        const newOrder = siblingsWithSameParent.findIndex(m => m.id === overId) + 1;
        
        await updateMenuOrder(activeId, newOrder);

      }
    } catch (error) {
      console.error('메뉴 순서 변경 실패:', error);
      // 실패 시 원래 상태로 복원
      setMenuTree(menuTree);
    }
  }, [menuTree, allMenus, reorderMenusInTree]);
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
    toggleMenuExpansion,
    saveChanges,
    clearAssignedMenus,
    
    // DND 함수
    handleDragEnd,
  };
}