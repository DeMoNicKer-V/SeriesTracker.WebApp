import {
    Button,
    Col,
    Divider,
    Flex,
    Radio,
    RadioChangeEvent,
    Row,
    Segmented,
    Typography,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SwapOutlined } from "@ant-design/icons";
interface Props {
    handleClickAll: () => void;
    handleClickALetter: () => void;
}
export const AZList = ({ handleClickAll, handleClickALetter }: Props) => {
    const engLettersList = [
        "Все",
        "0-9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];

    const rusLettersList = [
        "Все",
        "0-9",
        "А",
        "Б",
        "В",
        "Г",
        "Д",
        "Е",
        "Ё",
        "Ж",
        "З",
        "И",
        "Й",
        "К",
        "Л",
        "М",
        "Н",
        "О",
        "П",
        "Р",
        "С",
        "Т",
        "У",
        "Ф",
        "Х",
        "Ц",
        "Ч",
        "Ш",
        "Щ",
        "Ъ",
        "Ы",
        "Ь",
        "Э",
        "Ю",
        "Я",
    ];
    const router = useRouter();
    const [value, setValue] = useState("Все");
    const [options, setOptions] = useState(engLettersList);

    const [optionsFlag, setFlag] = useState(false);
    const changeOptions = () => {
        setFlag((current) => !current);
    };
    const searchParams = useSearchParams();
    useEffect(() => {
        optionsFlag === true
            ? setOptions(rusLettersList)
            : setOptions(engLettersList);
    }, [optionsFlag]);

    useEffect(() => {
        if (searchParams.get("alphabet") === null) {
            setValue("Все");
        }
    }, [searchParams]);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
        if (e.target.value === "Все") {
            router.push(`/series`);
            handleClickAll();
        } else {
            router.push(`/search?alphabet=${e.target.value}`);
            handleClickALetter();
        }
    };
    const { Text, Title } = Typography;
    return (
        <Row gutter={[10, 10]}>
            <Col span={24}>
                <Flex gap={5} justify="start" align="center">
                    <Segmented<Boolean>
                        options={[
                            { label: "A-Z", value: false },
                            { label: "А-Я", value: true },
                        ]}
                        onChange={changeOptions}
                    />
                    <Divider type="vertical" />
                    <Text>
                        {
                            "Поиск ваших сериалов в алфавитном порядке по названию."
                        }
                    </Text>
                </Flex>
            </Col>
            <Col span={24}>
                <Radio.Group
                    onChange={onChange}
                    value={value}
                    options={options}
                    optionType="button"
                />
            </Col>
        </Row>
    );
};

export default AZList;
