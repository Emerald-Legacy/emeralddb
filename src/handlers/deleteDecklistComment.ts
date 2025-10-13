import { getComment, deleteComment } from '../gateways/storage'
import { Request, Response } from 'express'

export async function handler(req: Request, res: Response): Promise<void> {
  const commentId = req.params.id
  const user = (req as any).auth as { sub: string }
  const comment = await getComment(commentId)
  if (!comment) {
    res.status(404).send()
    return
  }
  if (comment.user_id !== user.sub) {
    res.status(403).send()
    return
  }
  await deleteComment(commentId)
  res.status(200).send()
}
