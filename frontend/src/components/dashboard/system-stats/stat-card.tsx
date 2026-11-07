import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  color: string;
  number: number;
  title: string;
  icon: string;
}

const colorClasses = {
  'red': {
    bg: 'bg-red-500/10',
    iconBg: 'bg-red-500/50',
    iconText: 'text-red-500',
    title: 'text-red-500/50',
    number: 'text-red-500'
  },
  'blue': {
    bg: 'bg-blue-500/10',
    iconBg: 'bg-blue-500/50',
    iconText: 'text-blue-500',
    title: 'text-blue-500/50',
    number: 'text-blue-500'
  },
  'green': {
    bg: 'bg-green-500/10',
    iconBg: 'bg-green-500/50',
    iconText: 'text-green-500',
    title: 'text-green-500/50',
    number: 'text-green-500'
  },
  'yellow': {
    bg: 'bg-yellow-500/10',
    iconBg: 'bg-yellow-500/50',
    iconText: 'text-yellow-500',
    title: 'text-yellow-500/50',
    number: 'text-yellow-500'
  },
} as const;

const StatCard = ({ color, number, title, icon }: Props) => {
  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`py-4 px-5 flex gap-3 items-center rounded-3xl ${classes.bg}`}>
      <div className={`w-12 h-12 rounded-lg flex justify-center items-center ${classes.iconBg} ${classes.iconText}`}>
        <Icon icon={icon} className="size-6" />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h5 className={`text-lg font-medium ${classes.title}`}>{title}</h5>
        <span className={`text-xl font-bold ${classes.number}`}>{number}</span>
      </div>
    </div>
  );
};

export default StatCard;