import { Typography } from '@material-ui/core'

export function NotLoggedIn(): JSX.Element {
  return (
    <>
      <Typography variant="h4" align="center">
        You need to be logged in to see this section.
      </Typography>
    </>
  )
}
