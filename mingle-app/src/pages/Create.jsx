import { useSelector } from "react-redux"
import TwoColumnLayout from "../components/layouts/TwoColumnLayout"
import CreatePostTemplate from "../components/templates/CreatePostTemplate"
import ProfileTemplate from "../components/templates/ProfileTemplate"


export default function Create() {

  const myProfile = useSelector((state)=>state.auth.userData);
  
  return (
    <>  
        <TwoColumnLayout
            hide={true}
            left={<ProfileTemplate small={true} profileData={myProfile}/>}
            right={<CreatePostTemplate/>}
        />
    </>     
  )
}