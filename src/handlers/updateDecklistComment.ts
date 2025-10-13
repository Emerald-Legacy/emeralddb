import { editComment, getComment } from '../gateways/storage/index'
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { DecklistComment, DecklistComments$update } from '@5rdb/api'

export const schema = {
  body: Joi.object<DecklistComments$update['request']['body']>({
    comment: Joi.string().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<DecklistComment | undefined> {
  const user = (req as any).auth as { sub: string }
  const comment = await getComment(req.params.id)
  if (!comment) {
    res.status(404).send()
    return
  }
  if (comment.user_id !== user.sub) {
    res.status(403).send()
    return
  }
  return editComment(req.params.id, req.body.comment)
}
