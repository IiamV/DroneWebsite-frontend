/**
 * Typed error handling utilities for Server Component data-fetching.
 *
 * Requirement 16.4: ALL Server Component data-fetching functions SHALL use
 * try/catch with typed error handling and SHALL NOT silently swallow errors.
 *
 * Pattern to follow in every Server Component that fetches data:
 *
 * ```ts
 * import { toAppError } from '@/lib/fetch-utils'
 *
 * async function getMyData(id: string): Promise<MyData> {
 *   try {
 *     const data = await someDataSource.find(id)
 *     if (!data) throw new NotFoundError(`Resource ${id} not found`)
 *     return data
 *   } catch (err) {
 *     // Re-throw as a typed AppError — never silently swallow
 *     throw toAppError(err)
 *   }
 * }
 * ```
 */

/** Discriminated union of typed application errors. */
export type AppErrorKind = 'not_found' | 'unauthorized' | 'forbidden' | 'server_error'

export class AppError extends Error {
  constructor(
    public readonly kind: AppErrorKind,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', cause?: unknown) {
    super('not_found', message, cause)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', cause?: unknown) {
    super('unauthorized', message, cause)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', cause?: unknown) {
    super('forbidden', message, cause)
    this.name = 'ForbiddenError'
  }
}

/**
 * Wraps an unknown caught value into a typed AppError.
 * Use this at the boundary of every data-fetching function so errors
 * propagate to the nearest error.tsx boundary with useful context.
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err
  if (err instanceof Error) {
    return new AppError('server_error', err.message, err)
  }
  return new AppError('server_error', String(err), err)
}
