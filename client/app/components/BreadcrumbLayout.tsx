import { Breadcrumb } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const BreadcrumbLayout = () => {
    const pathname = usePathname();
    const pathArray = pathname?.split("/").filter(Boolean);

    return (
        <Breadcrumb>
            {pathArray.map((path, index) => (
                <Breadcrumb.Item key={index} href={path}>
                    {path}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default BreadcrumbLayout;
