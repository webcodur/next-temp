// 기본 GridForm 컴포넌트들
import GridForm from './GridForm';
import GridFormRow from './GridFormRow';
import GridFormSequence from './GridFormSequence';
import GridFormLabel from './GridFormLabel';
import GridFormContent from './GridFormContent';
import GridFormRules from './GridFormRules';
import GridFormViewSelector from './GridFormViewSelector';
import GridFormRulesModal from './GridFormRulesModal';

// Compound Components 구성
const CompoundGridForm = Object.assign(GridForm, {
	Row: GridFormRow,
	Sequence: GridFormSequence,
	Label: GridFormLabel,
	Rules: GridFormRules,
	Content: GridFormContent,
	ViewSelector: GridFormViewSelector,
	RulesModal: GridFormRulesModal,
});

// 기본 export
export default CompoundGridForm;

// 개별 컴포넌트 export
export {
	GridForm,
	GridFormRow,
	GridFormSequence,
	GridFormLabel,
	GridFormContent,
	GridFormRules,
	GridFormViewSelector,
	GridFormRulesModal,
};

// Schema 기반 자동 렌더링
export { default as GridFormAuto } from './GridFormAuto';

// 타입 export
export type * from './types';
export type { GridFormViewMode } from './types';
