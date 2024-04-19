export const range = (start: number, stop: number, step = 1): number[] => {
	const a = [start];
	let b = start;
	while (b < stop) {
		b += step;
		a.push(b);
	}
	return a;
};

export const konst = (x) => () => x;
