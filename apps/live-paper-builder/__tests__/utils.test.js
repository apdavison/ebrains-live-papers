import { expect, test } from "vitest";
import { formatTimeStampToLongString, formatAuthors } from "../src/utils";

test("formats datetime string as expected", () => {
  expect(formatTimeStampToLongString("2023-11-17T10:36:35.080614+00:00")).toBe("Fri, 17 Nov 2023 10:36:35 GMT");
});

test("formats author names as expected", () => {
    const data = [
        {given_name: "Stan", family_name: "Laurel"},
        {given_name: "Oliver", family_name: "Hardy"},
    ];
    expect(formatAuthors(data)).toBe("Stan Laurel, Oliver Hardy")
})