import '@testing-library/jest-dom/extend-expect';
import fromEntries from 'object.fromentries';

if (!Object.fromEntries) {
	fromEntries.shim();
}
