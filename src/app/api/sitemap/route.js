import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import xmlbuilder from 'xmlbuilder';

export async function GET() {
  try {
    // Fetch all photos from Supabase
    const { data: photos, error } = await supabase
      .from('image_details')
      .select('id, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Base URL - set to the official Netlify site
    const baseUrl = 'https://whispers-through-my-lens.netlify.app';
    
    // Build XML
    const root = xmlbuilder.create('urlset', { 
      version: '1.0', 
      encoding: 'UTF-8' 
    })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    .att('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd');

    // Add static pages
    const staticPages = ['', '/gallery', '/about', '/contact'];
    
    staticPages.forEach(page => {
      root.ele('url')
        .ele('loc').text(`${baseUrl}${page}`).up()
        .ele('lastmod').text(new Date().toISOString()).up()
        .ele('changefreq').text('weekly').up()
        .ele('priority').text(page === '' ? '1.0' : '0.8');
    });
    
    // Add dynamic photo pages
    photos.forEach(photo => {
      root.ele('url')
        .ele('loc').text(`${baseUrl}/photo/${photo.id}`).up()
        .ele('lastmod').text(new Date(photo.updated_at).toISOString()).up()
        .ele('changefreq').text('monthly').up()
        .ele('priority').text('0.7');
    });

    // Convert to XML string
    const xml = root.end({ pretty: true });
    
    // Return XML with proper content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

// Ensure this route is not statically generated, but dynamic
export const dynamic = 'force-dynamic';