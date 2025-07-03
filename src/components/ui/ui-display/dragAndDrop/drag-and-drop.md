# DragAndDrop 컴포넌트

드래그 앤 드롭 기능을 제공하는 컴포넌트입니다.

## 주요 특징

- **HTML5 Drag API**: 네이티브 드래그 기능 활용
- **파일 업로드**: 파일 드래그 지원
- **요소 재정렬**: 리스트 아이템 순서 변경
- **시각적 피드백**: 드래그 상태 표시
- **접근성**: 키보드 지원

## 기본 사용법

```tsx
import { DragAndDrop } from '@/components/ui/ui-display/dragAndDrop/DragAndDrop';

function MyComponent() {
  const [items, setItems] = useState([
    { id: 1, text: '항목 1' },
    { id: 2, text: '항목 2' },
    { id: 3, text: '항목 3' }
  ]);

  const handleReorder = (newItems) => {
    setItems(newItems);
  };

  return (
    <DragAndDrop
      items={items}
      onReorder={handleReorder}
      renderItem={(item) => (
        <div className="p-4 bg-white border rounded">
          {item.text}
        </div>
      )}
    />
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `items` | `any[]` | - | 드래그 가능한 아이템 목록 (필수) |
| `onReorder` | `(items: any[]) => void` | - | 순서 변경 콜백 (필수) |
| `renderItem` | `(item: any) => React.ReactNode` | - | 아이템 렌더링 함수 (필수) |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 드래그 방향 |
| `disabled` | `boolean` | `false` | 드래그 비활성화 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

## 사용 예시

### 기본 리스트 재정렬

```tsx
function TodoReorder() {
  const [todos, setTodos] = useState([
    { id: 1, text: '회의 준비', completed: false },
    { id: 2, text: '보고서 작성', completed: true },
    { id: 3, text: '이메일 확인', completed: false }
  ]);

  return (
    <DragAndDrop
      items={todos}
      onReorder={setTodos}
      renderItem={(todo) => (
        <div className={`p-3 bg-white border rounded flex items-center ${
          todo.completed ? 'opacity-60' : ''
        }`}>
          <input
            type="checkbox"
            checked={todo.completed}
            className="mr-3"
            readOnly
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.text}
          </span>
        </div>
      )}
      className="space-y-2"
    />
  );
}
```

### 가로 카드 정렬

```tsx
function CardDeck() {
  const [cards, setCards] = useState([
    { id: 1, suit: '♠', value: 'A' },
    { id: 2, suit: '♥', value: 'K' },
    { id: 3, suit: '♣', value: 'Q' }
  ]);

  return (
    <DragAndDrop
      items={cards}
      onReorder={setCards}
      direction="horizontal"
      renderItem={(card) => (
        <div className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center">
          <span className={`text-2xl ${
            ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'
          }`}>
            {card.suit}
          </span>
          <span className="text-lg font-bold">{card.value}</span>
        </div>
      )}
      className="flex space-x-2"
    />
  );
}
```

### 파일 업로드 영역

```tsx
function FileUploadDrop() {
  const [files, setFiles] = useState([]);

  const handleFileDrop = (droppedFiles) => {
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        onDrop={(e) => {
          e.preventDefault();
          const droppedFiles = Array.from(e.dataTransfer.files);
          handleFileDrop(droppedFiles);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>파일을 여기에 드래그하거나 클릭하여 선택하세요</p>
      </div>

      {files.length > 0 && (
        <DragAndDrop
          items={files}
          onReorder={setFiles}
          renderItem={(file) => (
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <span className="flex-1">{file.name}</span>
              <span className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                onClick={() => setFiles(prev => 
                  prev.filter(f => f !== file)
                )}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
          className="mt-4 space-y-1"
        />
      )}
    </div>
  );
}
``` 