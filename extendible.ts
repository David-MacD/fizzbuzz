// some useful utils
const range = (start: number, stop: number, step = 1): number[] => {
	const a = [start];
	let b = start;
	while (b < stop) {
		b += step;
		a.push(b);
	}
	return a;
};

const konst = (x) => () => x;

type Monoid<T> = {
	concat: (x: T) => T;
};

// Maybe type
type MaybeTag = "Just" | "Nothing";
class Maybe<T> {
	tag: MaybeTag;
	value: T;
	constructor(tag: MaybeTag) {
		this.tag = tag;
	}

	static Just: <T>(value: T) => Maybe<T>;
	static Nothing: Maybe<never>;

	get [Symbol.toPrimitive]() {
		switch (this.tag) {
			case "Just":
				return `${this.tag}(${this.value})`;
			case "Nothing":
				return this.tag;
			default:
				return "";
		}
	}

	map(f) {
		switch (this.tag) {
			case "Just":
				return Maybe.Just(f(this.value));
			case "Nothing":
				return this;
		}
	}

	static concat<M extends Monoid<M>>(m1: Maybe<M>, m2: Maybe<M>) {
		switch (m1.tag) {
			case "Just":
				switch (m2.tag) {
					case "Just":
						return Maybe.Just(m1.value.concat(m2.value));
					case "Nothing":
						return m1;
				}
				break;
			case "Nothing":
				switch (m2.tag) {
					case "Just":
						return m2;
					case "Nothing":
						return Maybe.Nothing;
				}
		}
	}
	concat<M extends Monoid<M>>(m2: Maybe<M>) {
		return Maybe.concat(this as unknown as Maybe<M>, m2);
	}
}

class Just<T> extends Maybe<T> {
	constructor(v: T) {
		super("Just");
		this.value = v;
	}
}

class Nothing<T> extends Maybe<T> {
	constructor() {
		super("Nothing");
	}
}

Maybe.Just = (v) => new Just(v);
Maybe.Nothing = new Nothing();

const fromMaybe = <T>(d: T, m: Maybe<T>) => (m.tag === "Just" ? m.value : d);

// define rules
type SubstitutionRule = (i: number) => Maybe<string>;
const rule =
	(predicate) =>
	(n: number, m: string): SubstitutionRule => {
		return (i) => {
			if (predicate(i, n)) {
				return Maybe.Just(m);
			}
			return Maybe.Nothing;
		};
	};

// As long as our f function returns a monoid with the concat method...
const fConcatReducer =
	(acc: SubstitutionRule, f: SubstitutionRule) => (x: number) =>
		acc(x).concat(f(x));

const substitute =
	(rules: SubstitutionRule[]) =>
	(list: number[]): string[] => {
		const f = (i: number) => {
			const ruleSet = rules.reduce(fConcatReducer, konst(Maybe.Nothing));
			return fromMaybe(i.toString(), ruleSet(i));
		};
		return list.map(f);
	};

const numberOfSetBits = (n) => n.toString(2).replace(/0/g, "").length;

const divisibleByRule = rule((i, n) => i % n === 0);
const setBitsLargerThan = rule((i, n) => numberOfSetBits(i) > n);

const fizz = divisibleByRule(3, "Fizz");
const buzz = divisibleByRule(5, "Buzz");
const bazz = setBitsLargerThan(3, "BAZZ");
const fizzbuzz = substitute([fizz, buzz, bazz]);

console.log(fizzbuzz(range(1, 100)));
