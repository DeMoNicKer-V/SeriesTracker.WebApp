import { Divider, Flex, Skeleton } from "antd";

const DaysWeekSkeleton = ({}) => {
    return (
        <div>
            <Flex gap={10} justify="center" className="width-100">
                {Array.from({ length: 7 }, (_, index) => (
                    <Skeleton.Button key={index} active={true} block />
                ))}
            </Flex>
            <Divider />
        </div>
    );
};
export default DaysWeekSkeleton;
