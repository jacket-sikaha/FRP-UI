import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
const { Header, Content, Footer, Sider } = Layout;

function ServerSlider() {
  return (
    <div>
      <Sider breakpoint="lg" collapsedWidth="0" className="h-full">
        <h1
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
          className="p-3"
        >
          FRP配置客户端
        </h1>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: <Link href={"/"}>配置状态</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined rev={undefined} />,
              label: <Link href={"/manage/frps"}>FRP服务器配置</Link>,
            },
            {
              key: "3",
              icon: <VideoCameraOutlined rev={undefined} />,
              label: "FRP客户端配置",
              children: [
                {
                  key: "4",
                  label: <Link href={"/manage/frpc"}>配置</Link>,
                },
                {
                  key: "5",
                  label: <Link href={"/drop-option"}>修改配置</Link>,
                },
                {
                  key: "15",
                  label: <Link href={"/manage/proxies"}>修改proxies配置</Link>,
                },
                {
                  key: "6",
                  // icon: <UploadOutlined rev={undefined} />,
                  label: <Link href={"/manage/frp-conf"}>配置文件编辑</Link>,
                },
              ],
            },
            {
              key: "7",
              icon: <UserOutlined rev={undefined} />,
              label: <Link href={"/profile"}>用户信息</Link>,
            },
          ]}
        />
      </Sider>
    </div>
  );
}

export default ServerSlider;
