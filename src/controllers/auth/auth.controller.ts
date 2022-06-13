import { Response } from 'express'
import bcrypt from 'bcrypt'
import { Request } from '../../helpers/type'
import { LoginBodyParams, SignUpBodyParams } from '../type'
import { BCRYPT_SALT_ROUNDS } from './constants'
import {
  createPrivateUserBasedOnRole,
  fetchOfficialRolMetaData,
  getPrivateUserBasedOnRole,
} from '../user.functions'
import { PrivateUser } from '../../models/user'

export const handleSignUp = async (
  req: Request<SignUpBodyParams>,
  res: Response,
) => {
  try {
    const { body } = req

    const hashedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS)
    const role = await fetchOfficialRolMetaData(body.roleId)
    const privateUserData = {
      name: body.name,
      username: body.username,
      password: hashedPassword,
      role,
    }

    const user = (await createPrivateUserBasedOnRole(
      privateUserData,
    )) as PrivateUser

    res.status(200).send(res.json(user))
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(500).send(res.json())
  }
}

export const handleLogin = async (
  req: Request<LoginBodyParams>,
  res: Response,
) => {
  try {
    const { body } = req

    const role = await fetchOfficialRolMetaData(body.roleId)
    const user = await getPrivateUserBasedOnRole(body.username, role)
    const isGood = bcrypt.compare(body.password, user.password)

    res.status(200).send(res.json(isGood))
  } catch (err) {
    res.status(500).send(res.json())
  }
}
