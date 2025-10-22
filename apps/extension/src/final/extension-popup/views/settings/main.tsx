import { Setting } from './components';

export const MainSettings = () => {

  return (
    <div>
      <Setting
        label="More features"
        action={<Setting.ArrowRightButton onClick={()=>{}} />}
      />
    </div>
  );
};
