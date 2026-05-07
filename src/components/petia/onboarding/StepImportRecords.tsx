import ImportVetRecordsScreen from "../ImportVetRecordsScreen";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  next: () => void;
}

const StepImportRecords = ({ petData, next }: Props) => (
  <div className="-mx-6">
    <ImportVetRecordsScreen
      petName={petData.name || "your pet"}
      mode="onboarding"
      onSkip={next}
      onComplete={() => next()}
    />
  </div>
);

export default StepImportRecords;
