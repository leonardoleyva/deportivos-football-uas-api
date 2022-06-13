import { Response } from 'express'
import bcrypt from 'bcrypt'
import { Request } from '../../helpers/type'
import { SignUpBodyParams } from '../type'
import { BCRYPT_SALT_ROUNDS } from './constants'
import {
  createPrivateUserBasedOnRole,
  fetchOfficialRolMetaData,
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
