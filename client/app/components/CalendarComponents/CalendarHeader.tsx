import { CalendarDateLabel } from "@/app/utils/dateUtils";
import { Divider, Flex, Skeleton, Tabs } from "antd";

interface CalendarHeaderProps {
    weekDays: CalendarDateLabel[];
    loading: boolean;
    onChangeDate: (key: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    weekDays,
    loading,
    onChangeDate,
}) => {
    return loading ? (
        <div>
            <Flex gap={10} justify="center" className="width-100">
                {Array.from({ length: 7 }, (_, index) => (
                    <Skeleton.Button key={index} active={true} block />
                ))}
            </Flex>
            <Divider />
        </div>
    ) : (
        <Tabs onChange={(key) => onChangeDate(key)} centered items={weekDays} />
    );
};

export default CalendarHeader;
