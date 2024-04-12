import React, {Component} from 'react';
import ImageCrop from './ImageCrop';
import {uploadUserProfileImage} from '../Helpers/user';
// import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
interface ImgEditorState {
  userProfilePic: string;
  editor: any;
  scaleValue: number;
  selectedImage: File | null;
}

import { SupabaseClient, Session } from '@supabase/supabase-js';

interface ImgEditorProps {
  supabase: SupabaseClient;
  session: Session;
}

/**
 * Component for editing and uploading user profile images.
 * The rendered Image Editor.
 */
class ImgEditor extends Component<ImgEditorProps, ImgEditorState> {
  /**
   * Constructor for ImgEditor component.
   * @param {object} props - The props passed to the component.
   * @param {object} context - The context passed to the component.
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      userProfilePic: '',
      editor: null,
      scaleValue: 1,
      selectedImage: null,
    };
  }

  // Sets the editor reference in the component's state.
  setEditorRef = (editor) => this.setState({editor});

  /**
   * Handles the crop action and uploads the cropped image to Supabase.
   * @async
   */
  onCrop = async () => {
    const {editor, selectedImage} = this.state;
    const {supabase, session} = this.props;

    if (editor !== null) {
      const canvasScaled = editor.getImageScaledToCanvas();
      canvasScaled.toBlob(async (blob) => {
        // Create a new File object from the cropped blob
        const croppedImageFile = new File([blob], selectedImage.name, {type: blob.type});

        // Set the cropped image URL in the component state
        const url = URL.createObjectURL(croppedImageFile);
        this.setState({userProfilePic: url});

        // Upload the cropped image to Supabase
        await uploadUserProfileImage(supabase, session.user.id, croppedImageFile, 'avatars', 'avatar');

        window.location.reload();
      });
    }
  };

  /**
   * Handles changes in the scale value.
   * @param {object} scaleChangeEvent - The scale change event.
   */
  onScaleChange = (scaleChangeEvent) => {
    const scaleValue = parseFloat(scaleChangeEvent.target.value);
    this.setState({scaleValue});
  };

  /**
   * Converts a Data URL to a File object.
   * @param {string} dataurl - The Data URL to convert.
   * @param {string} filename - The name of the file.
   * @return {File} - The File object.
   */
  DataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  };

  /**
   * Handles the change event for the profile picture input.
   * @param {object} fileChangeEvent - The file change event.
   */
  profilePicChange = (fileChangeEvent) => {
    const file = fileChangeEvent.target.files[0];
    const {type} = file;
    if (!(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg') || type.endsWith('gif'))) {
    } else {
      this.setState({selectedImage: fileChangeEvent.target.files[0]});
    }
  };

  /**
   * Renders the ImgEditor component.
   * @return {JSX.Element} - The rendered React element.
   */
  render() {
    return (
      <div className="App dark:text-lightBG md:w-full w-72 md:h-full">
        <input type="file" className='text-md' name="profilePicBtn" accept="image/png, image/jpeg" onChange={this.profilePicChange} />
        <ImageCrop
          imageSrc={this.state.selectedImage}
          setEditorRef={this.setEditorRef}
          onCrop={this.onCrop}
          scaleValue={this.state.scaleValue}
          onScaleChange={this.onScaleChange}
        />
      </div>

    );
  }
}

export default ImgEditor;
