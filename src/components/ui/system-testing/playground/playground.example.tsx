/*
  파일명: src/components/ui/system-testing/playground/playground.example.tsx
  기능: 자유롭게 테스트할 수 있는 빈 예제 공간
  책임: 개발자가 필요에 따라 컴포넌트나 코드를 테스트할 수 있는 빈 공간을 제공한다.
*/

export default function PlaygroundExample() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">자유 테스트 공간</h1>
			<p className="text-muted-foreground mb-6">
				여기서 자유롭게 컴포넌트와 코드를 테스트해보세요.
			</p>
			<div className="p-8 border-2 border-dashed border-muted rounded-lg">
				{/* 여기에 테스트할 내용을 추가하세요 */}
			</div>
		</div>
	);
} 