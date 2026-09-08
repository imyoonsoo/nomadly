"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import type { ActivityFormValues } from "@/features/activity-form/types";
import useLeaveBlocker from "@/features/activity-form/hooks/useLeaveBlocker";
import {
  CATEGORY_OPTIONS,
  EMPTY_ACTIVITY_FORM,
} from "@/features/activity-form/constants";

import TextArea from "@/components/Input/TextArea";
import TextInput from "@/components/Input/TextInput";
import Button from "@/components/Button/Button";
import WarningModal from "@/components/Modal/WarningModal";
import SuccessIconModal from "@/components/Modal/SuccessIconModal";

import FormSelectDropdown from "./FormSelectDropdown";
import FormMultiImageInput from "./FormMultiImageInput";
import FormPriceInput from "./FormPriceInput";
import AddressSearchButton from "./AddressSearchButton";
import { ScheduleSection } from "./ScheduleSection";

interface ActivityFormProps {
  mode: "create" | "edit";
  defaultValues?: ActivityFormValues;
  onSubmit: (data: ActivityFormValues) => Promise<void>;
}

const ActivityForm = ({ mode, defaultValues, onSubmit }: ActivityFormProps) => {
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [hasScheduleDuplicate, setHasScheduleDuplicate] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty, isSubmitSuccessful, isSubmitting },
  } = useForm<ActivityFormValues>({
    mode: "onChange",
    defaultValues: defaultValues ?? EMPTY_ACTIVITY_FORM,
  });

  const { allowLeave } = useLeaveBlocker({
    isDirty: isDirty && !isSubmitSuccessful,
    onBlock: (targetUrl) => {
      setPendingUrl(targetUrl);
      setIsWarningModalOpen(true);
    },
  });

  const handleConfirmLeave = () => {
    setIsWarningModalOpen(false);

    allowLeave();

    if (pendingUrl === "back") {
      window.history.go(-2);
    } else if (pendingUrl) {
      router.push(pendingUrl);
    }

    setPendingUrl(null);
  };

  const handleCancelLeave = () => {
    setIsWarningModalOpen(false);
    setPendingUrl(null);
  };

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    router.push("/mypage/activities");
  };

  const isSubmitDisabled =
    !isDirty || !isValid || hasScheduleDuplicate || isSubmitting;

  const handleFormSubmit: SubmitHandler<ActivityFormValues> = async (data) => {
    if (!data.bannerImageUrl) {
      return;
    }

    try {
      await onSubmit(data);
      setIsSuccessModalOpen(true);
    } catch {
      return;
    }
  };

  return (
    <div className="mb-12 w-full lg:px-17.5">
      <h1 className="text-18-bold mb-6 py-2.5 text-gray-950">
        {mode === "create" ? "📍내 체험 등록" : "📍내 체험 수정"}
      </h1>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex w-full flex-col justify-center gap-6 md:gap-7.5"
      >
        <TextInput
          {...register("title", { required: "제목을 입력해 주세요" })}
          label="제목"
          placeholder="제목을 입력해 주세요"
          errorMessage={errors.title?.message}
          labelClassName="text-16-bold"
        />

        <FormSelectDropdown
          control={control}
          name="category"
          options={CATEGORY_OPTIONS}
          placeholder="카테고리를 선택해주세요"
          fieldLabel="카테고리"
          rules={{ required: true }}
        />

        <TextArea
          {...register("description", {
            required: "체험에 대한 설명을 입력해 주세요",
          })}
          label="설명"
          placeholder="체험에 대한 설명을 입력해 주세요"
          textareaClassName="h-35 md:h-50"
          errorMessage={errors.description?.message}
          labelClassName="text-16-bold"
        />

        <FormPriceInput control={control} />

        <div className="flex items-end gap-3">
          <TextInput
            {...register("address", { required: "주소를 입력해 주세요" })}
            label="주소"
            placeholder="주소를 입력해 주세요"
            className="flex-1"
            value={watch("address")}
            disabled
            errorMessage={errors.address?.message}
            labelClassName="text-16-bold"
          />
          <AddressSearchButton
            onSelect={(address) => {
              setValue("address", address, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
        </div>

        <ScheduleSection
          control={control}
          onDuplicateChange={setHasScheduleDuplicate}
        />

        <FormMultiImageInput
          control={control}
          name="bannerImageUrl"
          label="배너 이미지 등록"
          maxCount={1}
          rules={{ required: true }}
        />

        <FormMultiImageInput
          control={control}
          name="subImageUrls"
          label="소개 이미지 등록"
          maxCount={4}
        />

        <Button
          variant="mainBlue"
          height="47md"
          type="submit"
          className="w-full hover:brightness-90 md:mx-auto md:w-60"
          disabled={isSubmitDisabled}
        >
          {isSubmitting
            ? "저장 중..."
            : mode === "create"
              ? "등록하기"
              : "수정하기"}
        </Button>
      </form>

      {isWarningModalOpen && (
        <WarningModal
          isOpen={isWarningModalOpen}
          onClose={handleCancelLeave}
          onConfirm={handleConfirmLeave}
          message={"저장되지 않았습니다.\n정말 뒤로 가시겠습니까?"}
        />
      )}

      {isSuccessModalOpen && (
        <SuccessIconModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessConfirm}
          message={
            mode === "create"
              ? "체험 등록이 완료되었습니다."
              : "수정이 완료되었습니다."
          }
        />
      )}
    </div>
  );
};

export default ActivityForm;
