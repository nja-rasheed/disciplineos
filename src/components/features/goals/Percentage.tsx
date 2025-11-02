type GoalPercentagePageProps = {
  subTasks: Array<{
    id: number;
    title: string;
    is_completed: boolean;
  }>;
};

// Remove 'async'
export default function GoalPercentagePage({subTasks} : GoalPercentagePageProps) {
  const total = subTasks.length;
  const completed = subTasks.filter(task => task.is_completed).length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="my-2">
      <h3 className="text-sm font-medium text-gray-400">Progress</h3>
      <p className="text-lg font-semibold">{percentage.toFixed(1)}%</p>
    </div>
  );
}