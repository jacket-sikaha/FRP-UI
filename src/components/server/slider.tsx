import { FileOutlined, HddOutlined, RocketOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
const { Header, Content, Footer, Sider } = Layout;

function ServerSlider() {
  return (
    <div>
      <Sider breakpoint="lg" collapsedWidth="0" className="">
        <Menu
          className="sticky top-0"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: <Link href={"/manage"}>配置状态</Link>,
            },
            // {
            //   key: "2",
            //   label: <Link href={"/manage/frps"}>FRP服务器配置</Link>,
            // },
            {
              key: "3",
              label: "FRP客户端配置",
              children: [
                {
                  key: "4",
                  icon: <HddOutlined />,
                  label: <Link href={"/manage/frpc"}>基础配置</Link>,
                },

                {
                  key: "15",
                  icon: <RocketOutlined />,
                  label: <Link href={"/manage/proxies"}>代理配置</Link>,
                },
                {
                  key: "6",
                  icon: <FileOutlined />,
                  label: <Link href={"/manage/frp-conf"}>配置文件编辑</Link>,
                },
              ],
            },
            // {
            //   key: "7",
            //   icon: <UserOutlined rev={undefined} />,
            //   label: <Link href={"/profile"}>用户信息</Link>,
            // },
          ]}
        />
      </Sider>
    </div>
  );
}

export default ServerSlider;
