"use client";

import { Suspense, startTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { ProfileEditFormValues, MyProfileRequestBody } from "../type";
import { useGetProfile } from "../hooks/useGetProfile";
import useUpdateProfile from "../hooks/useUpdateProfile";
import useUploadProfileImage from "../hooks/useUploadProfileImage";
import TextInput from "@/components/Input/TextInput";
import ProfileImageInput from "@/components/ImageInput/ProfileImageInput";
import Button from "@/components/Button/Button";
import Title from "@/app/(mypage)/_components/Title";
import { showToast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import EmptyLoading from "@/assets/images/empty-loading.svg";

const DEFAULT_ERROR_MESSAGE = "오류가 발생했어요. 잠시 후 다시 시도해 주세요.";

const STATUS_MESSAGES: Record<string, string> = {
  "400": "입력한 내용이 올바른지 확인해주세요.",
  "401": "로그인 후 다시 시도해주세요.",
  "404": "사용자 정보가 존재하지 않습니다.",
};

const toErrorMessage = (error: unknown): string => {
  const status = error instanceof Error ? error.message : "";
  return STATUS_MESSAGES[status] ?? DEFAULT_ERROR_MESSAGE;
};

const ProfileSkeleton = () => (
  <div className="mx-auto flex w-full flex-col items-center gap-6 px-4 md:w-119 lg:w-160">
    <div className="mb-3.25 flex animate-pulse flex-col gap-2.5 self-stretch md:mb-7.5">
      <div className="h-5.5 w-16 rounded bg-gray-200" />
      <div className="h-5 w-60 rounded bg-gray-200" />
    </div>
    <EmptyLoading width={180} height={180} />
    <div className="flex animate-pulse flex-col items-center gap-6 self-stretch">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5 self-stretch">
          <div className="h-6 w-14 rounded bg-gray-200" />
          <div className="h-13.5 rounded-2xl bg-gray-200" />
        </div>
      ))}
      <div className="h-11.75 w-full rounded-[14px] bg-gray-200" />
    </div>
  </div>
);

const ProfileEditFormContent = () => {
  const { data: user } = useGetProfile();
  const { mutate: updateProfile, isPending: isProfileUpdating } =
    useUpdateProfile();
  const {
    mutateAsync: uploadProfileImage,
    isPending: isProfileImageUploading,
  } = useUploadProfileImage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<ProfileEditFormValues>({
    mode: "onBlur",
    defaultValues: {
      nickname: user.nickname,
      email: user.email,
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  useEffect(() => {
    reset({
      nickname: user.nickname,
      email: user.email,
      newPassword: "",
      newPasswordConfirm: "",
    });
  }, [user, reset]); // 유저 데이터가 캐싱되거나 새롭게 들어올 때마다 실행

  // watch는 안전하게 메모이제이션할 수 없어 컴포넌트 최적화 대상에서 제외된다는 공식 문서
  // 훅 기반인 useWatch로 변경
  const newPassword = useWatch({ control, name: "newPassword" }) || "";
  const currentNickname = useWatch({ control, name: "nickname" }) || "";

  const handleProfileSubmit = async (data: ProfileEditFormValues) => {
    try {
      if (data.newPassword && data.newPassword !== data.newPasswordConfirm) {
        showToast.error("비밀번호가 일치하지 않습니다.");
        return;
      }

      // MyProfileRequestBody에 변경사항 추가
      const updatedProfile: MyProfileRequestBody = {};

      // 닉네임 변경 시
      // isDirty는 클릭 1번으로 변경을 true로 처리하는 문제로 !== 추가
      if (data.nickname !== user.nickname) {
        updatedProfile.nickname = data.nickname;
      }

      // 비밀번호 변경 시
      if (data.newPassword) {
        updatedProfile.newPassword = data.newPassword;
      }

      // 프로필 변경 시
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const imageResponse = await uploadProfileImage(formData);
        updatedProfile.profileImageUrl = imageResponse.profileImageUrl;
      }

      // 변경사항 X ➝ 조기 리턴
      if (Object.keys(updatedProfile).length === 0) {
        showToast("변경사항이 없습니다.");
        return;
      }

      // 변경사항 O ➝ 프로필 수정 API 호출
      updateProfile(updatedProfile, {
        // 저장 성공 시 ProfileEditForm 초기화하여 변경 감지 상태 리셋
        onSuccess: () => {
          reset({
            nickname: data.nickname,
            email: data.email,
            newPassword: "",
            newPasswordConfirm: "",
          });
          setSelectedImage(null);

          // 각 변경사항마다 토스트 다르게 띄워지도록
          const changedItems: string[] = [];
          if (updatedProfile.nickname) {
            changedItems.push("닉네임");
          }
          if (updatedProfile.newPassword) {
            changedItems.push("비밀번호");
          }
          if (updatedProfile.profileImageUrl) {
            changedItems.push("프로필");
          }

          // 변경사항: 1개
          if (changedItems.length === 1) {
            showToast.success(`${changedItems[0]} 변경이 완료되었습니다.`);
          }
          // 변경사항: 1개 이상 -> ,로 이어 토스트에 표시
          else {
            showToast.success(
              `${changedItems.join(", ")} 변경이 완료되었습니다.`,
            );
          }
          startTransition(() => {
            router.refresh();
          });
        },
        onError: (error) => {
          showToast.error(toErrorMessage(error));
        },
      });
    } catch (error) {
      showToast.error(toErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-6 px-4 md:w-119 lg:w-160">
      <div className="self-stretch">
        <Title
          title="내 정보"
          description="닉네임과 비밀번호를 수정하실 수 있습니다."
        />
      </div>

      <ProfileImageInput
        name="profileImage"
        label="프로필"
        onFileSelect={(file) => {
          setSelectedImage(file);
        }}
        defaultImage={user.profileImageUrl}
      />

      <form
        onSubmit={handleSubmit(handleProfileSubmit)}
        className="flex flex-col items-center gap-6 self-stretch"
      >
        <TextInput
          label="닉네임"
          placeholder="새로운 닉네임을 10자 이하로 입력해 주세요"
          className="self-stretch"
          errorMessage={errors.nickname?.message}
          {...register("nickname", {
            required: "닉네임을 입력해 주세요.",
            maxLength: {
              value: 10,
              message: "닉네임은 10자 이하로 입력해주세요.",
            },
          })}
        />

        <TextInput
          label="이메일"
          disabled
          className="self-stretch disabled:cursor-not-allowed"
          {...register("email")}
        />

        <TextInput
          label="새 비밀번호"
          type="password"
          placeholder="8자 이상 입력해 주세요"
          className="self-stretch"
          errorMessage={errors.newPassword?.message}
          {...register("newPassword", {
            validate: (value) => {
              if (!value) {
                return true;
              }
              if (value.length < 8) {
                return "8자 이상 입력해 주세요.";
              }
              if (
                !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~\-])\S+$/.test(
                  value,
                )
              ) {
                return "영문, 숫자, 특수문자 각 1자 이상 조합해 입력해주세요.";
              }
              return true;
            },
          })}
        />

        <TextInput
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          className="self-stretch"
          errorMessage={errors.newPasswordConfirm?.message}
          {...register("newPasswordConfirm", {
            validate: (value) => {
              return value === newPassword || "비밀번호가 일치하지 않습니다.";
            },
          })}
        />

        <Button
          type="submit"
          variant="mainBlue"
          height="47md"
          className="mt-2 w-full font-bold whitespace-nowrap shadow-sm transition-all"
          disabled={
            isProfileUpdating ||
            isProfileImageUploading ||
            !isValid ||
            (currentNickname === user.nickname &&
              !newPassword &&
              !selectedImage)
          }
        >
          {isProfileUpdating || isProfileImageUploading
            ? "변경사항 저장 중..."
            : "변경사항 저장하기"}
        </Button>
      </form>
    </div>
  );
};

export const ProfileEditForm = () => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <div className="flex min-h-[50vh] items-center justify-center text-lg font-medium text-red-600 md:text-xl">
          {toErrorMessage(error)}
        </div>
      )}
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileEditFormContent />
      </Suspense>
    </ErrorBoundary>
  );
};
