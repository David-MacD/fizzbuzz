import { range } from "./util.ts";

const divisibleBy = (n: number, d: number) => (n % d === 0 ? true : false);

function fizzBuzz(list: number[]): string[] {
	const result: string[] = [];
	for (const num of list) {
		if (divisibleBy(num, 15)) result.push("FizzBuzz");
		else if (divisibleBy(num, 5)) result.push("Buzz");
		else if (divisibleBy(num, 3)) result.push("Fizz");
		else result.push(num.toString());
	}
	return result;
}

const result = fizzBuzz(range(1, 100));
console.log(result);
