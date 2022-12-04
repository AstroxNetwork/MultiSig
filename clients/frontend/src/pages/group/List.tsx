import { RootDispatch } from "@/store";
import { PageContainer } from "@ant-design/pro-components"
import { Button } from "antd";
import { useDispatch } from "react-redux";


const GroupList: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>()
  return (
    <PageContainer ghost>
      111
      <Button onClick={() => {
        dispatch.app.save({ slideMode: 'wallet'})
      }}>wallet in</Button>
    </PageContainer>
  )
}


export default GroupList;