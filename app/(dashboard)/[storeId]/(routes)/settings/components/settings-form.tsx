'use client';

import { Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

import { Button, Input, Separator } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';

interface Props {
  initialData: Store;
}

const formShema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formShema>;

export const SettingsForm: React.FC<Props> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formShema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage Store preferences' />
        <Button variant='destructive' size='sm' onClick={() => {}}>
          <Trash className='w-4 h-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Store name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};
