import { Request as RequestExpress } from "express"

export type Request<T> = RequestExpress<any, any, T, qs.ParsedQs>
