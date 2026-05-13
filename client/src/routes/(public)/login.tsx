import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/login"!</div>
}
