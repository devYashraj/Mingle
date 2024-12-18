import TwoColumnLayout from "../components/layouts/TwoColumnLayout"
import CreatePostTemplate from "../components/templates/CreatePostTemplate"
import ProfileTemplate from "../components/templates/ProfileTemplate"

import { myProfile } from "../utils/sampleData"

export default function Create() {
  return (
    <>  
        <TwoColumnLayout
            hide={true}
            left={<ProfileTemplate small={false} profileData={myProfile}/>}
            right={<CreatePostTemplate/>}
        />
    </>     
  )
}