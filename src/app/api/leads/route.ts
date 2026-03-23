import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize SDKs (They will be undefined if keys are missing initially)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const resendApiKey = process.env.RESEND_API_KEY || '';

// We use the Service Role Key to bypass RLS and insert securely from the backend
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source_calculator, language } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // --- 1. Save to Supabase ---
    if (supabase) {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([
          { 
            email, 
            calculator_source: source_calculator, 
            language: language || 'pt',
            created_at: new Date().toISOString()
          }
        ]);
        
      if (dbError) {
        console.error('Supabase DB Error:', dbError.message);
        // We log it but continue to try to send the email anyway
      }
    } else {
      console.warn('Supabase keys missing. Skipping DB insertion for:', email);
    }

    // --- 2. Send via Resend ---
    if (resend) {
      const isEnglish = language === 'en';
      
      // Global default is now the Mortgage spreadsheet
      let spreadsheetFileEn = 'mortgage-amortization-tracker.xlsx';
      let spreadsheetFilePt = 'planilha-financiamento-sac-price.xlsx';

      if (source_calculator === 'percentage-calculator' || source_calculator === 'calculadora-de-porcentagem') {
        spreadsheetFileEn = 'percentage-master-sheet.xlsx';
        spreadsheetFilePt = 'planilha-porcentagem.xlsx';
      }

      const activeFile = isEnglish ? spreadsheetFileEn : spreadsheetFilePt;
      
      const subject = isEnglish 
        ? 'Your Free Premium Tracking Spreadsheet inside! 📊'
        : 'Sua Planilha de Acompanhamento Grátis chegou! 📊';
        
      const htmlContent = isEnglish
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #007AFF;">Welcome to CalcForgeTools!</h2>
            <p>Thank you for using our <strong>${source_calculator.replace(/-/g, ' ')}</strong> tool.</p>
            <p>As promised, here is the link to download your Free Tracking Spreadsheet (Excel format):</p>
            <div style="margin: 30px 0;">
              <a href="https://calcforgetools.com/downloads/${activeFile}" style="background-color: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Spreadsheet</a>
            </div>
            <p>If the button doesn't work, copy and paste this link:</p>
            <p style="color: #666; font-size: 14px;">https://calcforgetools.com/downloads/${activeFile}</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px;">CalcForgeTools Engineering Team</p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #007AFF;">Bem-vindo ao CalcForgeTools!</h2>
            <p>Obrigado por utilizar a nossa ferramenta <strong>${source_calculator.replace(/-/g, ' ')}</strong>.</p>
            <p>Conforme prometido, aqui está o link para você baixar a sua Planilha de Acompanhamento Grátis oficial (formato Excel):</p>
            <div style="margin: 30px 0;">
              <a href="https://calcforgetools.com/downloads/${activeFile}" style="background-color: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Baixar Planilha</a>
            </div>
            <p>Se o botão não funcionar, copie e cole o link abaixo:</p>
            <p style="color: #666; font-size: 14px;">https://calcforgetools.com/downloads/${activeFile}</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px;">Equipe de Engenharia Financeira da CalcForgeTools</p>
          </div>
        `;

      const { error: emailError } = await resend.emails.send({
        from: 'CalcForgeTools <hello@calcforgetools.com>',
        to: [email],
        subject: subject,
        html: htmlContent
      });

      if (emailError) {
        console.error('Resend Email Error:', emailError.message);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    } else {
      console.warn('Resend API key missing. Skipping email delivery for:', email);
    }

    return NextResponse.json({ success: true, message: 'Lead captured and email processed.' });

  } catch (err: any) {
    console.error('API /leads internal error:', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
