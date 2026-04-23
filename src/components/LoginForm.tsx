import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { usePostIdentityApiV1UsersAuthLogin } from "@/api/gen/identity/autenticação/autenticação"
import { useAuthStore } from "@/store/auth-store"
import { useNavigate } from "react-router-dom"

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  // 1. Inicializa o hook de mutação do Orval/TanStack Query
  const { mutateAsync: loginMutation } = usePostIdentityApiV1UsersAuthLogin()
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Handler de submissão atualizado
  async function onSubmit(values: LoginFormValues) {
    try {

      const response = await loginMutation({
        data: values
      })
      
      if(response.user && response.token){
        useAuthStore.getState().setAuth(response.user, response.token, response.refreshToken);
      }
      
      toast.success("Login realizado com sucesso!")
      navigate('/');

      /*eslint-disable-next-line */
    } catch (error: any) {
      
      // Erro: Trata falhas de rede ou credenciais inválidas
      console.error("Erro no login:", error)
      
      const errorMessage = "E-mail ou senha incorretos."
      toast.error(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Entre com seu e-mail e senha para acessar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      type="email" 
                      disabled={form.formState.isSubmitting} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="******" 
                      type="password" 
                      disabled={form.formState.isSubmitting} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
