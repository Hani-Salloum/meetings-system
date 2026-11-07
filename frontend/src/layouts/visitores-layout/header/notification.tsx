import ShinyButton from "@/components/ui/shiny-button"
import { Icon } from "@iconify/react/dist/iconify.js"

function Notification() {
  return (
    <ShinyButton className="bg-card  py-2.5 px-4">
      <div>
        <Icon icon="mingcute:notification-newdot-line" width="22" height="22" className="text-primary-foreground font-bold" />
      </div>
    </ShinyButton>
  )
}

export default Notification
