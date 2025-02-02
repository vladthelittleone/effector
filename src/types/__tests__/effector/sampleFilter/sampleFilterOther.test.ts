/* eslint-disable no-unused-vars */
import {
  createStore,
  createEvent,
  createEffect,
  sample,
  Store,
  Event,
} from 'effector'
const typecheck = '{global}'

test('clock param name in the function', () => {
  const trigger: Event<number> = createEvent()
  const allow: Store<string> = createStore('no')

  const result1 = sample({
    //@ts-expect-error
    source: trigger,
    filter: allow,
  })
  const result2 = sample({
    //@ts-expect-error
    source: trigger,
    clock: trigger,
    filter: allow,
  })
  const result3 = sample({
    //@ts-expect-error
    clock: trigger,
    filter: allow,
  })

  expect(typecheck).toMatchInlineSnapshot(`
    "
    Argument of type '{ source: Event<number>; filter: Store<string>; }' is not assignable to parameter of type '{ error: \\"filter should be a boolean unit\\"; got: Store<string>; }'.
      Object literal may only specify known properties, and 'source' does not exist in type '{ error: \\"filter should be a boolean unit\\"; got: Store<string>; }'.
    Argument of type '{ source: Event<number>; clock: Event<number>; filter: Store<string>; }' is not assignable to parameter of type '{ error: \\"filter should be a boolean unit\\"; got: Store<string>; }'.
      Object literal may only specify known properties, and 'source' does not exist in type '{ error: \\"filter should be a boolean unit\\"; got: Store<string>; }'.
    Argument of type '{ clock: Event<number>; filter: Store<string>; }' is not assignable to parameter of type '{ error: \\"filter should be a boolean unit\\"; got: Store<string>; }'.
      Object literal may only specify known properties, and 'clock' does not exist in type '{ error: \\"filter should be a boolean unit\\"; got: Store<string>; }'.
    "
  `)
})

test('custom typeguards: target array support (1)', () => {
  function debounce<T>(event: Event<T>): Event<T> {
    return event
  }
  const $store = createStore<string | number>(0)
  const $flag = createStore(false)
  const trigger = createEvent<{a: number}>()

  const targetA = createEffect<{field: number | string; data: number}, void>()
  const targetB = createEvent<{field: number | string; data: string}>()
  const targetC = createEvent<{field: unknown; data: number}>()
  const targetD = createEvent<{field: number; data: number}>()
  const targetE = createEvent<{field: any}>()
  const targetF = createEvent<{field: any; data: any; extra: boolean}>()
  const targetVoid = createEvent()
  const targetAny = createEvent<any>()

  const res = sample({
    source: sample({
      clock: debounce(trigger),
      source: [$flag, $store],
      fn: ([isAble, field], data) => (isAble ? {field, data} : null),
    }),
    filter: (e): e is {field: number | string; data: number} => !!e,
    target: [
      targetVoid,
      targetA,
      //@ts-expect-error
      targetB,
      targetC,
      //@ts-expect-error
      targetD,
      targetE,
      //@ts-expect-error
      targetF,
      targetAny,
    ],
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Binding element 'isAble' implicitly has an 'any' type.
    Binding element 'field' implicitly has an 'any' type.
    Parameter 'data' implicitly has an 'any' type.
    Argument of type '{ source: Event<{ field: any; data: any; } | null>; filter: (e: any) => e is { field: string | number; data: number; }; target: [Event<void>, Effect<{ field: string | number; data: number; }, void, Error>, ... 5 more ..., Event<...>]; }' is not assignable to parameter of type '{ source: Event<{ field: any; data: any; } | null>; clock?: undefined; fn: (src: { field: any; data: any; } | null) => any; target?: [Event<void>, Effect<{ field: string | number; data: number; }, void, Error>, ... 5 more ..., Event<...>] | undefined; }'.
      Object literal may only specify known properties, and 'filter' does not exist in type '{ source: Event<{ field: any; data: any; } | null>; clock?: undefined; fn: (src: { field: any; data: any; } | null) => any; target?: [Event<void>, Effect<{ field: string | number; data: number; }, void, Error>, ... 5 more ..., Event<...>] | undefined; }'.
    Parameter 'e' implicitly has an 'any' type.
    "
  `)
})

test('custom typeguards: target array support (2)', () => {
  function debounce<T>(event: Event<T>): Event<T> {
    return event
  }
  const $store = createStore<string | number>(0)
  const $flag = createStore(false)
  const trigger = createEvent<{a: number}>()

  const targetA = createEffect<{field: number | string; data: number}, void>()
  const targetB = createEvent<{field: number | string; data: string}>()
  const targetC = createEvent<{field: unknown; data: number}>()
  const targetD = createEvent<{field: string; data: number}>()
  const targetE = createEvent<{field: any}>()
  const targetF = createEvent<{field: any; data: any; extra: boolean}>()

  const targetVoid = createEvent()
  const targetAny = createEvent<any>()

  const res = sample({
    source: sample({
      clock: debounce(trigger),
      source: [$flag, $store],
      fn: ([isAble, field], data) => (isAble ? {field, data} : null),
    }),
    filter: (e): e is {field: number; data: number} => !!e,
    target: [
      targetVoid,
      targetA,
      //@ts-expect-error
      targetB,
      targetC,
      //@ts-expect-error
      targetD,
      targetE,
      //@ts-expect-error
      targetF,
      targetAny,
    ],
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Binding element 'isAble' implicitly has an 'any' type.
    Binding element 'field' implicitly has an 'any' type.
    Parameter 'data' implicitly has an 'any' type.
    Argument of type '{ source: Event<{ field: any; data: any; } | null>; filter: (e: any) => e is { field: number; data: number; }; target: [Event<void>, Effect<{ field: string | number; data: number; }, void, Error>, ... 5 more ..., Event<...>]; }' is not assignable to parameter of type '{ source: Event<{ field: any; data: any; } | null>; clock?: undefined; fn: (src: { field: any; data: any; } | null) => any; target?: [Event<void>, Effect<{ field: string | number; data: number; }, void, Error>, ... 5 more ..., Event<...>] | undefined; }'.
      Object literal may only specify known properties, and 'filter' does not exist in type '{ source: Event<{ field: any; data: any; } | null>; clock?: undefined; fn: (src: { field: any; data: any; } | null) => any; target?: [Event<void>, Effect<{ field: string | number; data: number; }, void, Error>, ... 5 more ..., Event<...>] | undefined; }'.
    Parameter 'e' implicitly has an 'any' type.
    "
  `)
})

test('generic support', () => {
  const source = createEvent<null | number>()
  const target = createEvent<number>()

  function filter<T>(value: T): value is NonNullable<T> {
    return value != null
  }

  sample({source, filter, target})

  expect(typecheck).toMatchInlineSnapshot(`
    "
    Argument of type '{ source: Event<number | null>; filter: <T>(value: T) => value is NonNullable<T>; target: Event<number>; }' is not assignable to parameter of type '{ error: \\"filter should be a boolean unit\\"; got: <T>(value: T) => value is NonNullable<T>; }'.
      Object literal may only specify known properties, and 'source' does not exist in type '{ error: \\"filter should be a boolean unit\\"; got: <T>(value: T) => value is NonNullable<T>; }'.
    "
  `)
})
