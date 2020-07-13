import { THandlerFun } from '~/main/types'

export const makeFactorial: THandlerFun = async ({ num }) => {
  function fact(n: number): number {
    if (n === 1) {
      return 1
    }
    return n * fact(n - 1)
  }

  console.log('making factorial')
  return fact(num)
}

export const ringring: THandlerFun = async () => {
  console.log('picking up the phone')
  return 'hello!'
}
