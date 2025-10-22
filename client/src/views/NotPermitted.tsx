import { Typography } from '@mui/material'

export function NotPermitted(props: { reason?: string }): JSX.Element {
  return (
    <>
      <Typography variant="h4" align="center">
        You are not permitted to see this section.
      </Typography>
      {props.reason && (
        <Typography variant="h6" align="center">
          {props.reason}
        </Typography>
      )}
    </>
  )
}
