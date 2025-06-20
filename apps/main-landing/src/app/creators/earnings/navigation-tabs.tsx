import {Button} from "@idriss-xyz/ui/button";

export function NavigationTabs() {
  return (
    <>
      <div className="inline-flex flex-row rounded-full bg-white gap-1 p-1">

            <div>
              <Button intent="secondary" size="medium" prefixIconName="LineChart">
                Stats
              </Button>
            </div>

            <div>
              <Button intent="secondary" size="medium" prefixIconName="History">
                Stats & History
              </Button>
            </div>

            <div>
              <Button intent="secondary" size="medium" prefixIconName="Trophy">
                Top Donors
              </Button>
            </div>

      </div>
    </>
  );
}
