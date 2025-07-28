import { CellType, FacilityLayout, MIN_CELL_SIZE, MAX_CELL_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE } from '@/types/facility-editor';
import { Undo, Redo, Square, Armchair, Package, Grid, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

// #region 타입 정의
interface EditorToolbarProps {
  layout: FacilityLayout;
  selectedTool: CellType;
  selectedCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onToolSelect: (tool: CellType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCellSizeChange: (size: number) => void;
  onGridSizeChange: (width: number, height: number) => void;
}
// #endregion

// #region 도구 설정
const TOOL_CONFIG = {
  seat: {
    icon: Armchair,
    label: '좌석',
    color: 'text-green-600',
    description: '좌석 배치'
  },
  object: {
    icon: Package,
    label: '사물',
    color: 'text-yellow-600',
    description: '사물 배치'
  },
  empty: {
    icon: Square,
    label: '빈공간',
    color: 'text-gray-500',
    description: '셀을 빈 상태로 변경'
  }
} as const;

// 도구 순서 정의
const TOOL_ORDER: CellType[] = ['seat', 'object', 'empty'];
// #endregion

// #region 메인 컴포넌트
export const EditorToolbar = ({
  layout,
  selectedTool,
  selectedCount,
  canUndo,
  canRedo,
  onToolSelect,
  onUndo,
  onRedo,
  onCellSizeChange,
  onGridSizeChange,
}: EditorToolbarProps) => {
  return (
    <div className="space-y-3">
      {/* 첫 번째 줄: 도구 선택 및 히스토리 */}
      <div className="flex items-center gap-4 p-4 neu-flat bg-serial-0 rounded-lg">
        {/* 선택 상태 표시 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            선택: <strong>{selectedCount}개</strong>
          </span>
        </div>

        {/* 구분선 */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* 도구 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">도구:</span>
          <div className="flex gap-1">
            {TOOL_ORDER.map((tool) => {
              const config = TOOL_CONFIG[tool];
              const Icon = config.icon;
              const isSelected = selectedTool === tool;
              
              return (
                <button
                  key={tool}
                  onClick={() => onToolSelect(tool as CellType)}
                  className={clsx(
                    'p-2 rounded-lg transition-all duration-150 flex items-center gap-2',
                    isSelected
                      ? 'neu-inset bg-serial-1'
                      : 'neu-raised hover:neu-inset hover:bg-serial-1'
                  )}
                  title={config.description}
                >
                  <Icon className={clsx('w-4 h-4', config.color)} />
                  <span className="text-sm font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* 히스토리 버튼 */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={clsx(
              'p-2 rounded-lg transition-all duration-150',
              canUndo
                ? 'neu-raised hover:neu-inset hover:bg-serial-1 text-foreground'
                : 'neu-flat text-gray-400 cursor-not-allowed'
            )}
            title="실행취소 (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={clsx(
              'p-2 rounded-lg transition-all duration-150',
              canRedo
                ? 'neu-raised hover:neu-inset hover:bg-serial-1 text-foreground'
                : 'neu-flat text-gray-400 cursor-not-allowed'
            )}
            title="다시실행 (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* 현재 상태 표시 */}
        <div className="ml-auto flex items-center gap-2 text-sm text-foreground">
          <span>선택된 도구: <strong>{TOOL_CONFIG[selectedTool].label}</strong></span>
          <span className="text-xs text-gray-500">
            1:좌석, 2:사물, 3:빈공간
          </span>
        </div>
      </div>

      {/* 두 번째 줄: 크기 조절 컨트롤 */}
      <div className="flex items-center gap-4 p-4 neu-flat bg-serial-0 rounded-lg">
        {/* 셀 크기 조절 */}
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-foreground">셀 크기:</span>
          <input
            type="range"
            min={MIN_CELL_SIZE}
            max={MAX_CELL_SIZE}
            value={layout.cellSize}
            onChange={(e) => onCellSizeChange(parseInt(e.target.value))}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer neu-inset"
          />
          <span className="text-sm text-gray-600 w-8 text-center">{layout.cellSize}</span>
        </div>

        {/* 구분선 */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* 그리드 크기 조절 */}
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-foreground">그리드 크기:</span>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">너비:</span>
            <input
              type="number"
              min={MIN_GRID_SIZE.width}
              max={MAX_GRID_SIZE.width}
              value={layout.gridSize.width}
              onChange={(e) => onGridSizeChange(parseInt(e.target.value), layout.gridSize.height)}
              className="w-16 px-2 py-1 text-sm rounded neu-inset bg-serial-1 border-none focus:outline-none focus:neu-flat"
            />
          </div>
          
          <span className="text-gray-400">×</span>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">높이:</span>
            <input
              type="number"
              min={MIN_GRID_SIZE.height}
              max={MAX_GRID_SIZE.height}
              value={layout.gridSize.height}
              onChange={(e) => onGridSizeChange(layout.gridSize.width, parseInt(e.target.value))}
              className="w-16 px-2 py-1 text-sm rounded neu-inset bg-serial-1 border-none focus:outline-none focus:neu-flat"
            />
          </div>
        </div>

        {/* 현재 그리드 정보 */}
        <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
          <span>총 셀: <strong>{layout.gridSize.width * layout.gridSize.height}개</strong></span>
          <span>사용 중: <strong>{layout.cells.length}개</strong></span>
        </div>
      </div>
    </div>
  );
};
// #endregion 