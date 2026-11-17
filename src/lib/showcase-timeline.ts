import { ShowcasePerson } from '@/content/showcase';

const TYPING_MS = 60;
const PAUSE_MS = 500;
const SEARCH_MS = 1600;
const RESULT_MS = 3200;

export type ShowcaseStage = 'typing' | 'pause' | 'searching' | 'done';
export type ShowcaseFrame = { personIndex: number; typed: number; stage: ShowcaseStage; durationMs: number };

function inputFields(person: ShowcasePerson): string[] {
  return [person.firstName, person.lastName, person.company];
}

function personFrames(person: ShowcasePerson, personIndex: number): ShowcaseFrame[] {
  const length = inputFields(person).join('').length;
  const typing = Array.from({ length }, (_, index) => ({ personIndex, typed: index + 1, stage: 'typing' as const, durationMs: TYPING_MS }));
  return [
    ...typing,
    { personIndex, typed: length, stage: 'pause', durationMs: PAUSE_MS },
    { personIndex, typed: length, stage: 'searching', durationMs: SEARCH_MS },
    { personIndex, typed: length, stage: 'done', durationMs: RESULT_MS },
  ];
}

export function buildFrames(people: ShowcasePerson[]): ShowcaseFrame[] {
  return people.flatMap(personFrames);
}

export function typedValues(person: ShowcasePerson, typed: number): string[] {
  let remaining = typed;
  return inputFields(person).map((field) => {
    const value = field.slice(0, Math.max(remaining, 0));
    remaining -= field.length;
    return value;
  });
}
