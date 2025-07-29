import { DownloadOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import Papa from "papaparse";
import { FormattedMessage } from "react-intl";
import * as XLSX from "xlsx";
import CButton from "../Button";
import { TypeCustom, TypeSizeCustom } from "../Button/enum";

interface ExportDataProps<T> {
  data: T[];
  fields: { [key in keyof T]?: string };
  fileName: string;
}

const ExportData = <T,>({ data, fields, fileName }: ExportDataProps<T>) => {
  const renameFields = (item: T): { [key: string]: unknown } => {
    const newItem: { [key: string]: unknown } = {};
    for (const key in item) {
      const newKey = fields[key as keyof T] || key;
      newItem[newKey] = item[key as keyof T];
    }
    return newItem;
  };

  const getFormattedTime = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${dd}${MM}${yyyy}${hh}${ss}${mm}`;
  };

  const handleDownloadCSV = () => {
    const renamedData = data.map(renameFields);
    const csv = Papa.unparse(renamedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${getFormattedTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const renamedData = data.map(renameFields);
    const json = JSON.stringify(renamedData, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${getFormattedTime()}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Revoke the object URL after use
  };

  const handleDownloadXLSX = () => {
    try {
      const renamedData = data.map(renameFields);
      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, `${fileName}_${getFormattedTime()}.xlsx`);
    } catch (error) {
      console.error("Error downloading XLSX:", error);
    }
  };

  const exportMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleDownloadCSV}>
        <FormattedMessage id="common.downloadCSV" />
      </Menu.Item>
      <Menu.Item key="2" onClick={handleDownloadJSON}>
        <FormattedMessage id="common.downloadJSON" />
      </Menu.Item>
      <Menu.Item key="3" onClick={handleDownloadXLSX}>
        <FormattedMessage id="common.downloadXLSX" />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={exportMenu} placement="bottomLeft">
      <CButton
        typeCustom={TypeCustom.Primary}
        sizeCustom={TypeSizeCustom.Medium}
        style={{ display: "flex", alignItems: "center", minWidth: 120 }}
        icon={<DownloadOutlined />}
      >
        <FormattedMessage id="Xuất excel" />
      </CButton>
    </Dropdown>
  );
};

export default ExportData;
