import React, {Component} from 'react';
import ImageCrop from './ImageCrop';
import { uploadUserProfileImage } from "../Helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
class ImgEditor extends Component {

    constructor(props, context) {
    super(props, context);
    this.state = {
      userProfilePic: '',
      editor: null,
      scaleValue: 1,
      selectedImage: null,
    };
  }

   setEditorRef = editor => this.setState({ editor });


   onCrop = async () => {
    const { editor, selectedImage } = this.state;
    const { supabase, session } = this.props;
  
    if (editor !== null) {
      const canvasScaled = editor.getImageScaledToCanvas();
      canvasScaled.toBlob(async (blob) => {
        // Create a new File object from the cropped blob
        const croppedImageFile = new File([blob], selectedImage.name, { type: blob.type });
  
        // Set the cropped image URL in the component state
        const url = URL.createObjectURL(croppedImageFile);
        this.setState({ userProfilePic: url });
  
        // Upload the cropped image to Supabase
        await uploadUserProfileImage(supabase, session.user.id, croppedImageFile, 'avatars', 'avatar');

        window.location.reload();
      });
    }
  };

  onScaleChange = (scaleChangeEvent) => {
    const scaleValue =  parseFloat(scaleChangeEvent.target.value);
    this.setState({ scaleValue });
  };

  DataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

 profilePicChange = (fileChangeEvent) => {
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (!(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg') || type.endsWith('gif'))) {
    } else {
      this.setState({ openCropper: true, selectedImage: fileChangeEvent.target.files[0], fileUploadErrors: [] });
    }
  };
  render(){
  return (
    <div className="App dark:text-lightBG">
       <input type="file" className='text-md' name="profilePicBtn" accept="image/png, image/jpeg" onChange={this.profilePicChange} />
       <ImageCrop   
          imageSrc={this.state.selectedImage}
          setEditorRef={this.setEditorRef}
          onCrop={this.onCrop}
          scaleValue={this.state.scaleValue}
          onScaleChange={this.onScaleChange}
        />

        {/* <img src={this.state.userProfilePic} /> */}
    </div>

  );
  }
}

export default ImgEditor;