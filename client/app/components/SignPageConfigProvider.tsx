import { ConfigProvider } from "antd";

interface Props {
    children: React.ReactNode;
}

const SignPageConfigProvider = ({ children }: Props) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Collapse: {
                        contentPadding: 0,
                        headerPadding: "0 0 24px 0",
                        boxShadow: "none !important",
                    },
                    Typography: {
                        colorLink: "#44a5a6",
                        colorLinkHover: "#44a5a661",
                        fontSize: 16,
                    },
                    Card: {
                        colorBgContainer: "#0b3c3c61",
                        colorBorderSecondary: "#0b3c3c",
                    },
                    Input: {
                        activeBg: "transparent",
                        colorBgContainer: "transparent",
                        fontSize: 16,
                        colorBorder: "#084949",
                    },
                    Form: {
                        labelFontSize: 16,
                        labelColor: "#44a5a6",
                        labelRequiredMarkColor: "#44a5a6",
                        colorSuccess: "#44a5a6",
                    },
                    DatePicker: {
                        colorBgElevated: "#123535",
                        fontSize: 16,
                    },
                    Button: { colorBorder: "#084949" },
                    Tooltip: {
                        colorBgSpotlight: "#123535",
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default SignPageConfigProvider;
