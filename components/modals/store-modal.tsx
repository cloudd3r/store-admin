'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { Modal } from '../ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button, Input } from '../ui';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal: React.FC = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/stores', values);

      window.location.assign(`/${res.data.id}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Create store'
      description='Add a new store to manage products and categories.'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='E-Commerce'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='pt-6 flex items-center justify-end w-full gap-2'>
                <Button
                  disabled={loading}
                  variant={'outline'}
                  onClick={storeModal.onClose}
                >
                  {' '}
                  Cancel{' '}
                </Button>
                <Button disabled={loading} type='submit'>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
